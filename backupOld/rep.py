#!/usr/bin/env python3
import re

def clean_neon_backup(input_file, output_file):
    """Neon backup-ыг Supabase-д тохируулан цэвэрлэх"""
    
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Phase 1: COPY командыг INSERT болгон хувиргах
    print("Phase 1: Converting COPY commands to INSERT...")
    
    # COPY загварыг олох
    copy_pattern = r'COPY\s+([a-zA-Z0-9_."\s]+?)\s*(?:\((.*?)\))?\s+FROM\s+STDIN;\n(.*?)\n\\\.'
    
    def replace_copy(match):
        full_table = match.group(1).strip().strip('"')
        columns = match.group(2).strip() if match.group(2) else None
        data_block = match.group(3)
        
        # Schema болон table name салгах
        if '.' in full_table:
            parts = full_table.split('.')
            if len(parts) >= 2:
                table_name = parts[-1].strip('"')
                schema = '.'.join(parts[:-1])
            else:
                table_name = full_table.strip('"')
                schema = None
        else:
            table_name = full_table.strip('"')
            schema = None
        
        # Schema хамааруулах
        if schema and schema != 'public':
            table_ref = f'{schema}.{table_name}'
        else:
            table_ref = table_name
        
        # Өгөгдлийн мөрүүдийг боловсруулах
        data_lines = data_block.split('\n')
        insert_statements = []
        
        batch_size = 50
        for batch_start in range(0, len(data_lines), batch_size):
            batch = data_lines[batch_start:batch_start + batch_size]
            values_list = []
            
            for line in batch:
                if not line.strip():
                    continue
                    
                # Тусгаарлагчийг тодорхойлох
                if '\t' in line:
                    values = line.split('\t')
                elif '|' in line:
                    values = line.split('|')
                else:
                    # Хэрэв ямар ч тусгаарлагч олдохгүй бол бүхэлд нь авна
                    values = [line]
                
                # Утга бүрийг форматлах
                formatted = []
                for val in values:
                    val = val.strip()
                    if val == '\\N' or val == '':
                        formatted.append('NULL')
                    elif val.replace('.', '', 1).replace('-', '', 1).isdigit() and val.count('.') <= 1:
                        formatted.append(val)
                    elif val.lower() in ['true', 'false']:
                        formatted.append(val.upper())
                    elif val.lower() == 'null':
                        formatted.append('NULL')
                    else:
                        # String утга
                        escaped = val.replace("'", "''")
                        formatted.append(f"'{escaped}'")
                
                values_list.append(f"({', '.join(formatted)})")
            
            if values_list:
                if columns:
                    insert_statements.append(f"INSERT INTO {table_ref} ({columns}) VALUES\n" + 
                                           ',\n'.join(values_list) + ';')
                else:
                    insert_statements.append(f"INSERT INTO {table_ref} VALUES\n" + 
                                           ',\n'.join(values_list) + ';')
        
        return '\n\n'.join(insert_statements)
    
    # COPY командуудыг солих
    content = re.sub(copy_pattern, replace_copy, content, flags=re.DOTALL)
    
    # Phase 2: Бусад асуудалтай командуудыг устгах
    print("Phase 2: Removing problematic commands...")
    
    patterns_to_remove = [
        r'^\\.*$',  # Бүх \ командууд
        r'ALTER\s+.*\s+OWNER\s+TO\s+\w+;',  # OWNER командууд
        r'SET\s+.*\s*=\s*[\'"]?neondb_owner[\'"]?',  # neondb_owner тохиргоо
        r'GRANT\s+.*\s+TO\s+neondb_owner;',  # neondb_owner-д зориулсан GRANT
        r'REVOKE\s+.*\s+FROM\s+neondb_owner;',  # neondb_owner-с зориулсан REVOKE
    ]
    
    for pattern in patterns_to_remove:
        content = re.sub(pattern, '', content, flags=re.MULTILINE | re.IGNORECASE)
    
    # Phase 3: Давхар хоосон мөрүүдийг цэвэрлэх
    print("Phase 3: Cleaning up whitespace...")
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    
    # Phase 4: Neon-specific extension-уудыг шалгах
    print("Phase 4: Checking for Neon-specific extensions...")
    
    # Supabase-д байхгүй extension-уудыг устгах
    neon_extensions = [
        r'CREATE\s+EXTENSION\s+IF\s+NOT\s+EXISTS\s+"neon";',
        r'CREATE\s+EXTENSION\s+IF\s+NOT\s+EXISTS\s+"pg_graphql";',
        r'CREATE\s+EXTENSION\s+"neon";',
        r'CREATE\s+EXTENSION\s+"pg_graphql";',
    ]
    
    for ext in neon_extensions:
        content = re.sub(ext, '-- Removed Neon-specific extension', content, flags=re.IGNORECASE)
    
    # Phase 5: Файлд бичих
    with open(output_file, 'w', encoding='utf-8') as f_out:
        f_out.write("-- Cleaned backup file for Supabase\n")
        f_out.write("-- Original from Neon, converted for Supabase\n\n")
        f_out.write(content)
    
    print(f"✅ Файл амжилттай цэвэрлэгдлээ: {output_file}")
    print(f"📊 Файлын хэмжээ: {len(content)} characters")
    
    # Мөн энгийнчлэгдсэн хувилбар үүсгэх
    simple_output = output_file.replace('.sql', '_simple.sql')
    with open(simple_output, 'w', encoding='utf-8') as f_simple:
        # Зөвхөн чухал командуудыг үлдээх
        important_patterns = [
            r'^CREATE TABLE.*$',
            r'^INSERT INTO.*$',
            r'^ALTER TABLE.*ADD CONSTRAINT.*$',
            r'^CREATE INDEX.*$',
            r'^CREATE OR REPLACE FUNCTION.*$',
        ]
        
        for line in content.split('\n'):
            if any(re.search(pattern, line, re.IGNORECASE) for pattern in important_patterns):
                f_simple.write(line + '\n')
    
    print(f"📄 Энгийнчлэгдсэн хувилбар: {simple_output}")

# Ажиллуулах
if __name__ == "__main__":
    input_file = "backup.sql"
    output_file = "backup_supabase_ready.sql"
    
    try:
        clean_neon_backup(input_file, output_file)
        
        # Оруулах командыг харуулах
        print("\n" + "="*60)
        print("✅ CONVERSION COMPLETE!")
        print("="*60)
        print("\nTo import into Supabase, run:")
        print(f"psql \"postgresql://postgres:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.co:6543/postgres?sslmode=require\" -f {output_file}")
        print("\nOr use the simpler version:")
        print(f"psql \"postgresql://postgres:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.co:6543/postgres?sslmode=require\" -f {output_file.replace('.sql', '_simple.sql')}")
        print("\nReplace [PASSWORD] with your actual password.")
        
    except FileNotFoundError:
        print(f"❌ Error: {input_file} файл олдсонгүй")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
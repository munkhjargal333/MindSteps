# prompts.py
"""
Монгол хэл дээрх AI Prompt Engineering Templates
DeepSeek-V3.2 загварт зориулсан сайжруулсан хувилбар

Онцлогууд:
- Thinking mode дэмжлэг
- Бүтэцтэй алдааны засвар
- Multi-turn conversation
- Монгол хэлний нарийн ширийн тохиргоо
"""

class PromptTemplates:
    """Prompt загваруудын цуглуулга - Production Ready"""
    
    # 🔹 Үндсэн систем промпт (Сайжруулсан)
    SYSTEM = """Та Монгол хэл дээр харилцдаг DeepSeek-V3.2 загвар дээр суурилсан AI туслах.
        Таны зарчим:
        - Товч, тодорхой, практик хариу өг
        - Монгол хэлний дүрэм зүйг сайтар дагаж мөрд
        - Тодорхой асуулт бол шууд хариул, бүдэг асуулт бол тодруулга асуу
        - Хэт урт догол мөрийг зайлс, гол санааг тодруул
        - Хэрэгтэй бол bullet point, жишээ ашигла

        Асуулт: {message}

        Хариулт:"""

    # 🔹 Загвар чиглүүлсэн - Bullet Points
    STYLE = """<think>
        Би энэ асуултад товч, бүтэцтэй хариу өгөх ёстой.
        Bullet point форматаар, нэг санааг нэг мөрөнд.
        </think>

        Асуултад bullet point-оор товч хариул. Дүрэм:
        - Нэг bullet = Нэг санаа
        - Гол санааг тодруул, дэлгэрэнгүй битгий яр
        - 3-5 bullet point-оос илүү бүү хийх
        - Практик хэрэглээтэй мэдээлэл өг

        Асуулт: {message}

        Хариулт:
        •"""

    # 🔹 Даалгавар задлах - Step-by-Step
    TASK = """<think>
        Даалгаврыг логик алхамуудад задлах хэрэгтэй.
        Алхам бүр ойлгомжтой, дарааллаар нь.
        </think>

        Даалгаврыг алхам алхмаар гүйцэтгэ:
        - Алхам бүрийг тодорхой тайлбарла
        - Хэрэгтэй тохиолдолд жишээ өг
        - Алхмуудыг логик дарааллаар байрлуул

        Даалгавар: {message}

        Алхмууд:
        1."""

    # 🔹 Нөхцөл дэвсгэртэй - Contextual
    CONTEXT = """<think>
        Энэ асуулт залуу хүмүүст хамаатай.
        Тэдний ойлгох түвшинд тохируулж тайлбарлах хэрэгтэй.
        Хэт академик үг хэллэг зайлах.
        </think>

        Та залуучуудад зориулж энгийн үгээр тайлбарла.
        Техник нэр томьёог энгийнээр тайлбарлаж өг.
        Ойлгомжтой жишээ ашигла.

        Нөхцөл: 16-25 насны залуучуудад
        Асуулт: {message}

        Тайлбар:"""

    # 🔹 Few-Shot Learning - Жишээ суралцах
    FEWSHOT = """<think>
        Би жишээ харж, адил хэв маягаар хариулах ёстой.
        Товч, тодорхой хэв маяг.
        </think>

        Жишээнүүдээс суралцаж хариул:

        Жишээ 1:
        Асуулт: "Python гэж юу вэ?"
        Хариулт: "Python бол программчлалын хэл, энгийн бичиглэлтэй, өргөн хэрэглээтэй."

        Жишээ 2:
        Асуулт: "AI гэж юу вэ?"
        Хариулт: "AI буюу хиймэл оюун ухаан нь компьютерт хүний мэт сэтгэх чадвар өгөх технологи."

        Жишээ 3:
        Асуулт: "API гэж юу вэ?"
        Хариулт: "API бол програмуудыг хоорондоо холбох интерфейс, мэдээлэл солилцох зам."

        Одоо таны асуултад ижил хэв маягаар хариул:
        Асуулт: {message}
        Хариулт:"""

    # 🔹 Chain-of-Thought - Алхам алхмаар бодох
    COT = """<think>
        Бодлогыг алхам алхмаар шийдэх хэрэгтэй.
        Бодлогын логикийг тодорхой харуул.
        Дундын дүгнэлт бүрийг тайлбарла.
        </think>

        Алхам алхмаар бодож хариул:
        - Асуултыг ойлго, юу шаардаж байгааг тодруул
        - Бодлогын алхам бүрийг тайлбарла
        - Дундын дүгнэлтүүдээ харуул
        - Эцсийн хариуг тодорхой өг

        Асуулт: {message}

        Бодолт:
        1. Эхлээд би"""

    # 🔹 Role Playing - Дүр бүтээсэн
    # ROLE = """<think>
    #     Би AI мэргэжилтний дүрд орж хариулж байна.
    #     10 жилийн туршлагатай мэргэжилтэн шиг хандах.
    #     Итгэлтэй, мэргэжлийн түвшинд хариулах.
    #     </think>

    #     Таны дүр: Монголын 10 жилийн туршлагатай AI мэргэжилтэн
    #     Танд дараах мэргэжил бий:
    #     - Machine Learning, Deep Learning
    #     - Natural Language Processing (Монгол хэлний туршлагатай)
    #     - AI Product Development
    #     - Ethics in AI

    #     Мэргэжилтний харилцаагаар хариул:
    #     Асуулт: {message}

    #     Мэргэжилтний хариулт:"""

     # 🔹 Role Playing - Дүр бүтээсэн
    ROLE = """<think>
        Би гэгээрэлд хүрсэн багшийн дүрд орж хариулж байна.
        Сэтгэлзүй, амьдралын утга учрыг тайлбарлаж, зөвлөгөө өгнө.
        Тайван, ухаалаг, гүнзгий өнгө аястай хариулна.
        </think>

        Таны дүр: Монголын гэгээрэлд хүрсэн багш, сэтгэлзүйч
        Танд дараах чадвар бий:
        - Сэтгэлзүйн зөвлөгөө, амьдралын ухаан
        - Буддын гүн ухаан, гэгээрлийн сургааль
        - Амьдралын утга учрыг тайлбарлах
        - Тайван, эерэг зөвлөгөө өгөх

        Гэгээрлийн багшийн харилцаагаар хариул:
        Асуулт: {message}

        Зөвлөгөө:"""


    # 🔹 JSON Format - Structured Output
    FORMAT = """<think>
        JSON формат шаардаж байна.
        Зөв JSON syntax дагах.
        </think>

        Текстийг дараах JSON форматаар буцаа:
        {{
            "keywords": ["түлхүүр үг 1", "түлхүүр үг 2"],
            "category": "Ангилал",
            "sentiment": "positive/negative/neutral"
        }}

        Анхааруулга: Зөвхөн JSON буцаа, нэмэлт тайлбар бүү хий.

        Текст: {message}

        JSON:
        {{"""

    # 🔹 Creative Writing - Бүтээлч бичлэг
    CREATIVE = """<think>
            Энэ бол бүтээлч бичлэгийн даалгавар.
            Уран зохиолын хэв маяг хэрэглэх.
            Сонирхолтой, уран сайхны найруулгаар бичих.
            </think>

            Уран зохиолын хэв маягаар бич:
            - Дүрслэл, зүйрлэл ашигла
            - Сэтгэл хөдөлгөм өгүүлбэр байгуул
            - Уншигчийг татах хэв маяг
            - Монгол уран зохиолын уламжлалыг хадгал

            Сэдэв: {message}

            Бүтээл:"""

    # 🔹 Debug/Analysis - Алдаа засах
    DEBUG = """<think>
        Код эсвэл бодлого дээрх алдааг шинжлэх хэрэгтэй.
        Алдааны шалтгааныг олж, засварлах арга санал болгох.
        </think>

        Алдааг задлан шинжил:
        1. Алдааны төрлийг тодорхойл
        2. Шалтгааныг тайлбарла
        3. Засварлах арга зааж өг
        4. Хэрэгтэй бол жишээ код харуул

        Бодлого/Код: {message}

        Задлал:
        **Алдаа:**"""

    # 🔹 Compare & Contrast - Харьцуулах
    COMPARE = """<think>
        Хоёр юмыг харьцуулж, ялгаа ба ижил төстэй талуудыг тодруулах.
        Бүтэцтэй, тэнцвэртэй харьцуулалт хийх.
        </think>

        Дараах зүйлийг харьцуулж тодруул:
        - Гол ялгаа юу вэ?
        - Ижил төстэй тал юу байна?
        - Давуу болон сул тал юу вэ?
        - Ямар нөхцөлд аль нь дээр вэ?

        Харьцуулах зүйлс: {message}

        Харьцуулалт:
        **Ялгаа:**"""

    @classmethod
    def get_all(cls) -> dict:
        """Бүх промптуудыг dictionary-р буцаах"""
        return {
            "system": cls.SYSTEM,
            "style": cls.STYLE,
            "task": cls.TASK,
            "context": cls.CONTEXT,
            "fewshot": cls.FEWSHOT,
            "cot": cls.COT,
            "role": cls.ROLE,
            "format": cls.FORMAT,
            "creative": cls.CREATIVE,
            "debug": cls.DEBUG,
            "compare": cls.COMPARE,
        }
    
    @classmethod
    def get_names(cls) -> dict:
        """Промптуудын товч нэрс"""
        return {
            "system": "Үндсэн систем",
            "style": "Bullet Points",
            "task": "Даалгавар задлах",
            "context": "Нөхцөлтэй",
            "fewshot": "Жишээ суралцах",
            "cot": "Chain-of-Thought",
            "role": "Дүр бүтээх",
            "format": "JSON формат",
            "creative": "Бүтээлч бичлэг",
            "debug": "Алдаа засах",
            "compare": "Харьцуулалт",
        }
    
    @classmethod
    def get_descriptions(cls) -> dict:
        """Промптуудын дэлгэрэнгүй тайлбар"""
        return {
            "system": "Ерөнхий зориулалттай AI туслахын дүр - Бүх төрлийн асуултад тохиромжтой",
            "style": "Bullet point-оор товч, тодорхой хариулт - Жагсаалт хэлбэрээр мэдээлэл авах",
            "task": "Даалгаврыг алхам алхмаар задлах - Төлөвлөгөө, заавар гаргах",
            "context": "Залуучуудад зориулсан энгийн тайлбар - Боловсролын контент",
            "fewshot": "Жишээнээс суралцах хэв маяг - Тогтсон форматаар хариулт авах",
            "cot": "Алхам алхмаар бодож хариулах - Математик, логик бодлого шийдэх",
            "role": "AI мэргэжилтний дүрд хариулах - Мэргэжлийн зөвлөгөө авах",
            "format": "JSON форматаар бүтэцтэй өгөгдөл - API, программчлалд ашиглах",
            "creative": "Уран зохиолын хэв маяг - Бүтээлч бичлэг, түүх",
            "debug": "Алдаа задлах, засах - Код эсвэл бодлогын алдаа олох",
            "compare": "Харьцуулалт хийх - Сонголт хийхэд тус болно",
        }
    
    @classmethod
    def get_system_for_type(cls, prompt_type: str) -> str:
        """
        Multi-turn chat-д ашиглах system prompt
        
        Args:
            prompt_type: Промптын төрөл
            
        Returns:
            System message
        """
        system_prompts = {
            "system": "Та ерөнхий зориулалттай AI туслах. Товч, тодорхой хариулах.",
            "style": "Та bullet point-оор хариулдаг AI. Товч, бүтэцтэй.",
            "task": "Та даалгаврыг алхам алхмаар задалдаг AI. Логик дараалал.",
            "context": "Та залуучуудад тайлбарладаг AI. Энгийн хэллэг ашигла.",
            "fewshot": "Та жишээ суралцдаг AI. Жишээний хэв маяг дага.",
            "cot": "Та алхам алхмаар боддог AI. Бодлогын логикийг харуул.",
            # "role": "Та AI мэргэжилтэн. 10 жилийн туршлагатай.",
            "role": "Та 10 жил бясалгал хийж гэгээрсэн хүн. Амьдралын ухаан өг.",
            "format": "Та JSON форматаар хариулдаг AI. Зөв синтаксээр.",
            "creative": "Та уран зохиолч AI. Бүтээлчээр бич.",
            "debug": "Та алдаа заслах AI мэргэжилтэн. Задлан шинжил.",
            "compare": "Та харьцуулалт хийдэг AI. Тэнцвэртэй үнэлэ.",
        }
        return system_prompts.get(prompt_type, system_prompts["system"])
    
    @classmethod
    def get_usage_examples(cls) -> dict:
        """Ашиглалтын жишээнүүд"""
        return {
            "system": "Сайн уу! Python-ийн талаар хэлээч?",
            "style": "Python-ийн гол онцлогуудыг хэл",
            "task": "Python суурилуулах алхмуудыг хэл",
            "context": "Python гэж юу вэ? Надад тайлбарлаарай",
            "fewshot": "JavaScript гэж юу вэ?",
            "cot": "5 + 3 * 2 - 4 / 2 = ?",
            "role": "AI салбар дахь career зөвлөгөө өг",
            "format": "Python нь хурдан хэл үү гэсэн текстийг JSON-д хөрвүүл",
            "creative": "Монголын хөвсгөлийн талаар богино түүх бич",
            "debug": "print('Hello World) - Энэ кодын алдааг зас",
            "compare": "Python болон JavaScript-ийг харьцуул",
        }

# ============ HELPER FUNCTIONS ============

def get_prompt(prompt_type: str, message: str) -> str:
    """
    Prompt үүсгэх хялбар функц
    
    Args:
        prompt_type: промптын төрөл (system, style, task, ...)
        message: хэрэглэгчийн мессеж
    
    Returns:
        str: Бэлэн промпт
    
    Example:
        >>> get_prompt("cot", "5 + 3 * 2 = ?")
        "Алхам алхмаар бодож хариул:..."
    """
    templates = PromptTemplates.get_all()
    template = templates.get(prompt_type, templates["system"])
    return template.format(message=message)

def validate_prompt_type(prompt_type: str) -> bool:
    """
    Prompt төрөл зөв эсэхийг шалгах
    
    Args:
        prompt_type: Шалгах төрөл
        
    Returns:
        bool: Зөв бол True
    """
    return prompt_type in PromptTemplates.get_all()

def get_prompt_info(prompt_type: str) -> dict:
    """
    Тодорхой prompt-ийн дэлгэрэнгүй мэдээлэл
    
    Args:
        prompt_type: Prompt төрөл
        
    Returns:
        dict: Нэр, тайлбар, жишээ
    """
    if not validate_prompt_type(prompt_type):
        return {"error": f"'{prompt_type}' байхгүй"}
    
    names = PromptTemplates.get_names()
    descriptions = PromptTemplates.get_descriptions()
    examples = PromptTemplates.get_usage_examples()
    
    return {
        "type": prompt_type,
        "name": names.get(prompt_type),
        "description": descriptions.get(prompt_type),
        "example": examples.get(prompt_type),
        "template": PromptTemplates.get_all()[prompt_type]
    }

# ============ TESTING ============
if __name__ == "__main__":
    # Test код
    print("🧪 Prompt Templates Test\n")
    print("=" * 60)
    
    # 1. Бүх prompt төрлүүдийг харах
    print("\n📋 Боломжтой prompt төрлүүд:")
    for ptype, name in PromptTemplates.get_names().items():
        print(f"  • {ptype:12} → {name}")
    
    # 2. Жишээ prompt үүсгэх
    print("\n🎯 Жишээ prompt (COT):")
    example = get_prompt("cot", "Python суралцах хамгийн зөв арга юу вэ?")
    print(example[:200] + "...")
    
    # 3. Prompt мэдээлэл авах
    print("\nℹ️  'cot' prompt-ийн мэдээлэл:")
    info = get_prompt_info("cot")
    print(f"  Нэр: {info['name']}")
    print(f"  Тайлбар: {info['description']}")
    print(f"  Жишээ: {info['example']}")
    
    print("\n✅ Тестүүд амжилттай!")
    print("=" * 60)
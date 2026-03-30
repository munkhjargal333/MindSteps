'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  UserCircle,
  Info,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MainHeader } from '@/components/organisms/MainHeader'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [displayError, setDisplayError] = useState<string | null>(null)

  const { login, loginWithGoogle, error, clearError } = useAuth()
  const searchParams = useSearchParams()
  const urlMessage = searchParams.get('message')

  useEffect(() => {
    if (urlMessage) {
      setDisplayError(decodeURIComponent(urlMessage))
    } else if (error) {
      setDisplayError(error)
    }
  }, [urlMessage, error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setDisplayError(null)
    setLoading(true)
    try {
      await login(email, password)
    } catch {
      // Error handled by context
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    clearError()
    setDisplayError(null)
    try {
      await loginWithGoogle()
    } catch {
      // Error handled by context
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <MainHeader />

        {/* Card */}
        <div className="bg-card border rounded-lg p-8 space-y-6">

          {/* Error Alert */}
          {displayError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg relative">
              <button
                onClick={() => setDisplayError(null)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-start gap-3 pr-8">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-destructive mb-1">Алдаа гарлаа</p>
                  <p className="text-sm text-destructive/80">{displayError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">И-мэйл хаяг</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="example@mail.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Нууц үг</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Уншиж байна...
                </>
              ) : (
                <>
                  Нэвтрэх
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Эсвэл</span>
            </div>
          </div>

          {/* Google Login */}
          <Button onClick={handleGoogleLogin} type="button" variant="outline" className="w-full" size="lg">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google-ээр нэвтрэх
          </Button>

          {/* Demo / Guest */}
          <div className="space-y-2">
            <Button asChild type="button" variant="outline" className="w-full" size="lg">
              <Link href="/demo">
                <UserCircle className="w-5 h-5 mr-2" />
                Туршиж үзэх 
              </Link>
            </Button>
            <div className="flex items-start gap-2 px-1">
              <Info className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">Бүртгэлгүйгээр демо хувилбарыг үзэх</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <p className="text-xs text-muted-foreground">
            Нэвтрэх товчийг дарснаар та манай{' '}
            <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
              Үйлчилгээний нөхцөл
            </Link>
            {' '}болон{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              Нууцлалын бодлого
            </Link>
            -тай зөвшөөрч байна.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Ачаалж байна...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}

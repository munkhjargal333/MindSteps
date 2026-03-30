"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ThemeToggle } from "@/components/atoms/ThemeToggle"
import { Checkbox } from "@/components/ui/checkbox"
import { Settings, User, Mail, Bell } from "lucide-react"

export default function TestPage() {
  return (
    <div className="p-10 space-y-10 bg-background min-h-screen">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold">MindSteps UI Kit</h1>
        <p className="text-muted-foreground">Shadcn компонентуудыг туршиж үзэх талбар.</p>
        <ThemeToggle />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. BUTTONS & DROPDOWN */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons & Interactions</CardTitle>
            <CardDescription>Төрөл бүрийн товчлуур болон меню.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Menu нээх</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Миний бүртгэл</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User className="mr-2 h-4 w-4"/> Профайл</DropdownMenuItem>
                <DropdownMenuItem><Settings className="mr-2 h-4 w-4"/> Тохиргоо</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive"><Mail className="mr-2 h-4 w-4"/> Гарах</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* 2. FORM & INPUTS */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">И-мэйл хаяг</Label>
              <Input type="email" id="email" placeholder="Email бичих..." />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Нөхцөлийг зөвшөөрөх</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Мэдээлэл хадгалах</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Та итгэлтэй байна уу?</DialogTitle>
                  <DialogDescription>
                    Энэ үйлдлийг буцаах боломжгүй бөгөөд дата хадгалагдах болно.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline">Цуцлах</Button>
                  <Button>Тийм, хадгал</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        {/* 3. TABS SECTION */}
        <div className="md:col-span-2">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Хэрэглэгчийн мэдээлэл</CardTitle>
                </CardHeader>
                <CardContent className="p-10 text-center border-2 border-dashed rounded-lg">
                  Энд хэрэглэгчийн үндсэн мэдээлэл харагдана.
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Мэдэгдлүүд</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center p-3 border rounded-md">
                    <Bell className="mr-4 text-blue-500" />
                    <p>Шинэ мэдээлэл ирлээ!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  )
}
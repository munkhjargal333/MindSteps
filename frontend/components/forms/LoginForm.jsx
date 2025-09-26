'use client'

import { use, useState } from "react"    
import { useRouter } from "next/navigation"
import { useRouter } from "next/navigation"


export default function LoginForm() {
    const [formData, setFormData] = useState({ 
        email: "", 
        password: "" 
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const {login, error} = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const result = await login(formData.email, formData.password);

        if (result.success) {
            router.push("/dashboard");
        } 

        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            })
        }
        


    

}
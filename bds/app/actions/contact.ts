'use server'

import prisma from '@/lib/prisma'
import { sendNewFormNotification } from '@/lib/mailer'

export type ContactFormState = {
  success: boolean
  message: string
} | null

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const fullName = formData.get('full_name') as string
  const phoneNumber = formData.get('phone_number') as string
  const message = formData.get('message') as string

  if (!fullName?.trim() || !phoneNumber?.trim()) {
    return {
      success: false,
      message: 'Vui lòng điền đầy đủ họ tên và số điện thoại.',
    }
  }

  if (!/^[0-9+\s\-()]{9,15}$/.test(phoneNumber.trim())) {
    return {
      success: false,
      message: 'Số điện thoại không hợp lệ.',
    }
  }

  try {
    await prisma.contact_form.create({
      data: {
        full_name: fullName.trim(),
        phone_number: phoneNumber.trim(),
        message: message?.trim() || null,
      },
    })

    // Gửi email thông báo – fire-and-forget (không block response)
    sendNewFormNotification({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      message: message?.trim() || null,
    }).catch((err) => console.error('[mailer] Lỗi gửi email:', err))

    return {
      success: true,
      message: 'Gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return {
      success: false,
      message: 'Có lỗi xảy ra. Vui lòng thử lại hoặc gọi trực tiếp.',
    }
  }
}

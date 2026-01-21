import supabaseAdmin from '../../config/supabaseAdmin.js'

export async function createStaffService({
  email,
  password,
  name,
  role,
}) {
  // 1. Tạo user trong Supabase Auth
  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

  if (authError) {
    throw new Error(authError.message)
  }

  const authUserId = authUser.user.id

  // 2. Thêm record vào bảng staff
  const { data, error: dbError } = await supabaseAdmin
    .from('staff')
    .insert([
      {
        user_id: authUserId,
        email,
        name,
        role,
      },
    ])
    .select()

  if (dbError) {
    throw new Error(dbError.message)
  }

  return data
}

export async function deleteStaffService(user_id) {
  if (!user_id) {
    throw new Error('Missing user_id')
  }

  // 1. Xóa staff record
  const { data, error: dbError } = await supabaseAdmin
    .from('staff')
    .delete()
    .eq('user_id', user_id)
    .select()

  if (dbError) {
    throw new Error(dbError.message)
  }

  // 2. Xóa user trong Supabase Auth
  const { error: authError } =
    await supabaseAdmin.auth.admin.deleteUser(user_id)

  if (authError) {
    throw new Error(authError.message)
  }

  return {
    message: 'Staff deleted successfully',
    deleted: data,
  }
}

export async function getStaffListService() {
  const { data, error } = await supabaseAdmin
    .from('staff')
    .select('*')

  if (error) throw error

  return data
}

export async function resetPassWordStaffService(email) {
    if(!email) {
        throw new Error('Email is required')
    }

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.APP_URL}/pages/reset-password`,
    })

    if (error) throw error

    return { message: 'Reset password email sent' }
}

export async function updateStaffService(user_id, email, name, role) {
  if (!user_id) throw new Error('User_id is required')

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.updateUserById(user_id, {
      ...(email && { email }),
      ...(name && { user_metadata: { name } }),
    })
  if (authError) throw authError

  const { data: staffData, error: staffError } =
    await supabaseAdmin
      .from('staff')
      .update({
        ...(email && { email }),
        ...(name && { name }),
        ...(role && { role }),
      })
      .eq('user_id', user_id)
      .select()

  if (staffError) throw staffError

  return { authData, staffData }
}





import { 
  createStaffService, 
  deleteStaffService, 
  getStaffListService,
  resetPassWordStaffService,
  updateStaffService, 
} from '../../services/admin/staff.service.js'

export async function createStaff(req, res, next) {
  try {
    const { email, password, name, role } = req.body

    const data = await createStaffService({
      email,
      password,
      name,
      role,
    })

    return res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}

export async function deleteStaff(req, res, next) {
  try{
    const { user_id } = req.body

    const result = await deleteStaffService(user_id)
    res.json(result)
  } catch (err){
    next(err)
  }
}

export async function getStaffList(req, res, next) {
  try {
    const staffList = await getStaffListService()
    res.status(200).json(staffList)
  } catch (err) {
    next(err)
  }
}

export async function resetPasswordStaff(req, res, next) {
  try{
    const { email } = req.body

    const result = await resetPassWordStaffService(email)
    res.json(result)
  } catch (err){
    next(err)
  }
}

export async function updateStaff(req, res, next) {
  try{
    const { user_id, email, name, role } = req.body

    const result = await updateStaffService(user_id, email, name, role)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

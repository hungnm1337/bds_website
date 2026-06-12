import ProjectForm from '../ProjectForm'

export default function NewProjectPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Thêm dự án mới</h1>
        <p className="text-gray-500 text-sm mt-1">Điền đầy đủ thông tin dự án và upload ảnh</p>
      </div>
      <ProjectForm />
    </div>
  )
}

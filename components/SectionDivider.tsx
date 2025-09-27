export default function SectionDivider({ title = "Section" }: { title?: string }) {
  return (
    <div className="border-t border-dashed border-gray-300 my-8">
      <div className="flex items-center justify-center">
        <div className="bg-white px-4">
          <span className="text-gray-500 text-sm">{title}</span>
        </div>
      </div>
    </div>
  )
}

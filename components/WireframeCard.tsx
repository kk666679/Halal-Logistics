interface WireframeCardProps {
  title?: string
  children?: React.ReactNode
}

export default function WireframeCard({ title, children }: WireframeCardProps) {
  return (
    <div className="border border-dashed border-gray-300 rounded-lg p-4">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {children || <div className="text-gray-500">Content placeholder</div>}
    </div>
  )
}

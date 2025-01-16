import { Badge } from '@/components/ui/badge'
import { Gamepad2 } from 'lucide-react'
type HashTagImage = {
  avg_color: string
  height: number
  image_type: number
  is_animated: boolean
  open_web_url: string

  uri: string
  url_list: string[]
  width: number
}
export type HashTag = {
  id: number
  image: HashTagImage
  namespace: number
  title: string
}
export default function HashTagRoomInfo({ tags }: { tags: HashTag[] }) {
  if (tags.length == 0) return <></>
  return (
    <div className='flex flex-col'>
      <div className='grid grid-cols-auto'>
        <div className='font-semibold w-fit'>Hash Tag</div>
        {tags.map((tag, i: number) => (
          <Badge key={i} className='w-fit'>
            <div>#</div>
            {tag.title}
          </Badge>
        ))}
      </div>
    </div>
  )
}

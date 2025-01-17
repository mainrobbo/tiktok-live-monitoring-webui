'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { debounce } from 'lodash'
import { ClipboardIcon, PaletteIcon } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { toast } from 'sonner'
type rgba = { r: number; g: number; b: number; a: number }
export function rgbaStringToHex(rgba: string): string {
  const rgbaRegex =
    /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([01]?(?:\.\d+)?))?\)$/

  const result = rgbaRegex.exec(rgba)

  if (!result) {
    throw new Error('Invalid RGBA or RGB string')
  }

  const r = parseInt(result[1], 10)
  const g = parseInt(result[2], 10)
  const b = parseInt(result[3], 10)
  const a = result[4] !== undefined ? parseFloat(result[4]) : 1

  const toHex = (n: number): string => {
    const hex = Math.round(n).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  const red = toHex(r)
  const green = toHex(g)
  const blue = toHex(b)

  const alpha = a < 1 ? toHex(Math.round(a * 255)) : ''

  return `#${red}${green}${blue}${alpha}`
}
export function rgbaToHex(
  r: number,
  g: number,
  b: number,
  a: number = 1,
): string {
  const toHex = (n: number): string => {
    const hex = Math.round(n).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  const red = toHex(r)
  const green = toHex(g)
  const blue = toHex(b)

  const alpha = toHex(Math.round(a * 255))

  return `#${red}${green}${blue}${a < 1 ? alpha : ''}`
}
export function hexToRgba(hex: string, alpha: number = 1) {
  const cleanHex = hex.replace(/^#/, '')

  if (cleanHex.length !== 3 && cleanHex.length !== 6) {
    throw new Error('Invalid hex color')
  }

  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map(char => char + char)
          .join('')
      : cleanHex

  const r = parseInt(fullHex.substring(0, 2), 16)
  const g = parseInt(fullHex.substring(2, 4), 16)
  const b = parseInt(fullHex.substring(4, 6), 16)
  return { r, g, b, a: alpha, rgba: `rgba(${r}, ${g}, ${b}, ${alpha})` }
}
function getDefaultValue(val?: string | rgba) {
  try {
    if (!val) return '#000000'
    if (typeof val !== 'string') {
      return rgbaToHex(val.r, val.g, val.b, val.a)
    }
    if (val.includes('rgba')) {
      return rgbaStringToHex(val)
    } else if (val.includes('#')) {
      return val
    }
    return '#000000'
  } catch (err) {
    return '#000000'
  }
}
// TODO Add support for manual input
export default function ColorPicker({
  value,
  onChange,
  open,
  setOpen,
  TriggerElement,
  options,
}: {
  value?: string | rgba
  open?: boolean
  setOpen?: (open: boolean) => void
  onChange?: (value: string) => any
  TriggerElement?: ReactNode
  options?: {
    result: 'hex' | 'rgba'
  }
}) {
  const [popOpen, setPopOpen] = useState(open || false)
  const [colorValue, setColorValue] = useState<string>(getDefaultValue(value))

  const [alpha, setAlpha] = useState<number>(0.7)
  const debounceNewValue = debounce(() => {
    if (onChange) {
      if (options?.result === 'rgba') {
        const result = hexToRgba(colorValue, alpha)
        return onChange(result.rgba)
      }
      return onChange(colorValue)
    }
  }, 500)
  useEffect(() => {
    debounceNewValue()
    return () => debounceNewValue.cancel()
  }, [colorValue, alpha])

  const copyToClipboard = (text: string) => {
    if (window.navigator) {
      navigator.clipboard.writeText(text)
      toast('Copied to clipboard')
    }
  }
  return (
    <Popover open={popOpen} onOpenChange={setOpen || setPopOpen}>
      <PopoverTrigger asChild>
        {TriggerElement ? (
          <div onClick={() => (setOpen ? setOpen(true) : setPopOpen(true))}>
            {TriggerElement}
          </div>
        ) : (
          <Button size={'icon'} variant='outline'>
            <PaletteIcon />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className='w-fit'>
        <div className='flex gap-2 w-full flex-col'>
          <div className='flex gap-2 w-full'>
            <div className='w-full'>
              <HexColorPicker
                color={colorValue}
                onChange={setColorValue}
                className='w-[100px]'
              />
              <Slider
                min={0}
                max={1}
                value={[alpha]}
                onValueChange={e => setAlpha(e[0])}
                step={0.1}
                className='my-5'
              />
            </div>
            <div className='flex flex-col w-full gap-3'>
              <div className='flex items-start gap-1 w-full'>
                <Input
                  value={colorValue}
                  readOnly
                  className='text-xs w-[100px] cursor-not-allowed uppercase tracking-widest font-medium'
                />
                <Button
                  size={'icon'}
                  className=''
                  onClick={() => copyToClipboard(colorValue)}
                >
                  <ClipboardIcon />
                </Button>
              </div>
              <Separator />
              <div className='flex flex-col gap-1 px-2 self-start'>
                <div className='flex items-center justify-between gap-2'>
                  R
                  <Input
                    value={hexToRgba(colorValue, alpha).r}
                    readOnly
                    className='text-xs w-[70px] cursor-not-allowed uppercase tracking-widest font-medium'
                  />
                </div>
                <div className='flex items-center justify-between'>
                  G
                  <Input
                    value={hexToRgba(colorValue, alpha).g}
                    readOnly
                    className='text-xs w-[70px] cursor-not-allowed uppercase tracking-widest font-medium'
                  />
                </div>
                <div className='flex items-center justify-between'>
                  B
                  <Input
                    value={hexToRgba(colorValue, alpha).b}
                    readOnly
                    className='text-xs w-[70px] cursor-not-allowed uppercase tracking-widest font-medium'
                  />
                </div>
                <div className='flex items-center justify-between'>
                  A
                  <Input
                    value={hexToRgba(colorValue, alpha).a}
                    readOnly
                    className='text-xs w-[70px] cursor-not-allowed uppercase tracking-widest font-medium'
                  />
                </div>
                <Button
                  size={'icon'}
                  className='w-full'
                  onClick={() =>
                    copyToClipboard(hexToRgba(colorValue, alpha).rgba)
                  }
                >
                  <ClipboardIcon /> RGBA
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

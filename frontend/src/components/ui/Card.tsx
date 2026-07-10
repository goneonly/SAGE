import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { cn } from '../../lib/cn'

// 카드 공용 프리미티브 — `rounded-xl border border-line bg-surface` 반복을 없앤다.
// as 로 li/section 등 시맨틱 태그를 유지한 채 같은 스킨을 입힐 수 있다.
type CardProps<T extends ElementType> = {
  as?: T
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>

function Card<T extends ElementType = 'div'>({ as, className, ...props }: CardProps<T>) {
  const Component = (as ?? 'div') as ElementType
  return (
    <Component className={cn('rounded-xl border border-line bg-surface', className)} {...props} />
  )
}

export default Card

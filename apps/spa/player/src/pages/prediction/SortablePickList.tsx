import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { PickSlot, type PickSlotRunner } from '@trail/modules-frontend';
import { GripIcon } from '@trail/shared/design/ui-react';

export type SortablePickListProps = {
  slots: Array<PickSlotRunner | null>;
  activePosition: number | null;
  onChoose: (position: number) => void;
  onMove: (from: number, to: number) => void;
};

const slotId = (position: number) => `slot-${position}`;

function SortableSlot({
  position,
  runner,
  isActive,
  onChoose,
}: {
  position: number;
  runner: PickSlotRunner | null;
  isActive: boolean;
  onChoose: (position: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slotId(position), disabled: !runner });
  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : undefined,
        position: 'relative',
      }}
    >
      <PickSlot
        position={position + 1}
        runner={runner}
        isActive={isActive}
        onChoose={() => onChoose(position)}
        dragHandle={
          runner && !runner.isWithdrawn ? (
            <button
              type="button"
              aria-label={`Déplacer ${runner.fullName}`}
              className="text-muted -mr-1.5 flex h-11 w-8 cursor-grab touch-none items-center justify-center border-0 bg-transparent"
              {...attributes}
              {...listeners}
            >
              <GripIcon size={18} />
            </button>
          ) : null
        }
      />
    </li>
  );
}

export function SortablePickList({
  slots,
  activePosition,
  onChoose,
  onMove,
}: SortablePickListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const ids = slots.map((_, position) => slotId(position));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }
    onMove(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ol className="m-0 flex list-none flex-col gap-[9px] p-0">
          {slots.map((runner, position) => (
            <SortableSlot
              key={slotId(position)}
              position={position}
              runner={runner}
              isActive={position === activePosition}
              onChoose={onChoose}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}

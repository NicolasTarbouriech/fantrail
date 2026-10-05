import { TrailEventAggregate } from '@trail/modules/race/domain';
import { TrailEventEntity } from '@trail/shared/database/data-access-main';

export function mapTrailEventAggregate(
  entity: TrailEventEntity,
): TrailEventAggregate {
  return new TrailEventAggregate(entity.id, {
    name: entity.name,
    logo:
      entity.logo && entity.logo_content_type
        ? { contentType: entity.logo_content_type, bytes: entity.logo }
        : null,
  });
}

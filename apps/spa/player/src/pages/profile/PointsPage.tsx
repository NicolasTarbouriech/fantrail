import { Card, Heading, Hero } from '@trail/shared/design/ui-react';
import { BackLink, DetailPage } from '@trail/shell/fantrail';

import { paths } from '../../app/paths';

const POSITION_WEIGHTS = [50, 48, 46, 44, 42];

const BONUSES = [
  ['Vainqueur trouvé', '75'],
  ['Top 3 dans le désordre', '150'],
  ['Top 3 dans l’ordre', '300'],
  ['Top 5 dans le désordre', '250'],
  ['Top 5 dans l’ordre', '500'],
  ['Positions exactes multiples', '(nombre × 5)²'],
];

export function PointsPage() {
  return (
    <DetailPage
      hero={
        <Hero
          leading={<BackLink to={paths.profile} label="Retour au profil" />}
          title="Comment on marque"
          subtitle="Top 5, outsiders, chrono du vainqueur et bonus"
        />
      }
    >
      <div className="grid items-start gap-3.5 md:grid-cols-2 md:gap-6">
        <Card
          variant="block"
          className="flex flex-col gap-2 p-4 text-sm leading-relaxed"
        >
          <Heading className="text-xl">1. Tes 5 picks</Heading>
          <p className="m-0">
            Chaque pick rapporte <b>(10 − écart de places) × poids</b>, si ton
            coureur finit dans le top 10. Hors du top 10, abandon ou forfait : 0
            point.
          </p>
          <p className="m-0">
            Poids selon ta place :{' '}
            {POSITION_WEIGHTS.map(
              (weight, index) => `${index + 1}ᵉ ${weight}`,
            ).join(' · ')}
            . Un 1ᵉʳ pick qui gagne vaut 500 points, un 1ᵉʳ pick qui finit 3ᵉ
            vaut 400.
          </p>
        </Card>
        <Card
          variant="block"
          className="flex flex-col gap-2 p-4 text-sm leading-relaxed"
        >
          <Heading className="text-xl">2. Le multiplicateur outsider</Heading>
          <p className="m-0">
            Les coureurs sont classés par index : le favori n°1 rapporte ×1.0,
            puis +0.1 par rang, jusqu’à ×2.0 à partir du 11ᵉ favori. Le
            multiplicateur s’applique aux points de position seulement.
          </p>
        </Card>
        <Card
          variant="block"
          className="flex flex-col gap-2 p-4 text-sm leading-relaxed"
        >
          <Heading className="text-xl">3. Le chrono du vainqueur</Heading>
          <p className="m-0">
            Jusqu’à 200 points. Tu perds des points à mesure que ton estimation
            s’éloigne du temps réel, et tu n’en marques plus au-delà de 3 %
            d’écart : 43 minutes sur une course gagnée en 24 h, 12 minutes sur 7
            h.
          </p>
        </Card>
        <Card variant="block" className="flex flex-col gap-2 p-4 text-sm">
          <Heading className="text-xl">4. Les bonus</Heading>
          <dl className="m-0 flex flex-col">
            {BONUSES.map(([label, points]) => (
              <div
                key={label}
                className="border-line flex justify-between gap-3 border-b-2 py-2 last:border-b-0"
              >
                <dt>{label}</dt>
                <dd className="m-0 font-bold">{points}</dd>
              </div>
            ))}
          </dl>
          <p className="text-muted m-0 text-xs">
            Les bonus se cumulent et ne sont pas multipliés.
          </p>
        </Card>
        <Card variant="flat" className="p-4 text-sm leading-relaxed">
          Ton prono compte s’il est complet au départ : 5 coureurs et un chrono.
          Un coureur retiré de la start list reste dans ton prono et vaut 0
          point : remplace-le avant le départ.
        </Card>
      </div>
    </DetailPage>
  );
}

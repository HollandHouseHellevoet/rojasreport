import SmartText, { isBlockquote, isAttribution } from './SmartText';

interface CaseLawCardProps {
  items: string[];
}

export default function CaseLawCard({ items }: CaseLawCardProps) {
  if (!items.length) return null;

  return (
    <div className="border-l-2 border-orange p-5 space-y-3">
      {items.map((item, i) => {
        // Short items with "Case:" or entity names: bold subheading
        if (item.length < 60 && !isBlockquote(item) && !isAttribution(item)) {
          return (
            <p key={i} className="font-body text-sm text-cream font-semibold">
              {item}
            </p>
          );
        }
        return <SmartText key={i} text={item} />;
      })}
    </div>
  );
}

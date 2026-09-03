const CATEGORY_STYLES = {
  'Food & Agricultural': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: '🌾',
  },
  Textile: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: '🧵',
  },
  'Plastic & Industrial': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: '♻️',
  },
  'E-Waste': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: '💻',
  },
  Construction: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: '🏗️',
  },
  Other: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: '📦',
  },
};

export default function CategoryBadge({ category, size = 'sm' }) {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES['Other'];
  const sizeClasses =
    size === 'lg'
      ? 'px-3 py-1.5 text-sm'
      : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}
    >
      <span>{style.icon}</span>
      {category}
    </span>
  );
}

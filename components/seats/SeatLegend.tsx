export function SeatLegend() {
  const items = [
    { box: 'border border-outline-variant bg-white', label: 'Available' },
    { box: 'border border-primary bg-primary-container', label: 'Selected' },
    {
      box: 'border border-outline-variant/50 bg-surface-container-highest',
      icon: 'close',
      label: 'Occupied',
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 border-t border-outline-variant pt-6">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded ${item.box}`}
          >
            {item.icon ? (
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                {item.icon}
              </span>
            ) : null}
          </div>
          <span className="text-label-md text-on-surface-variant">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

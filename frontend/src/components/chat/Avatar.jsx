import { useMemo } from "react";

const COLORS = [
  "#90CDF4",
  "#F56565",
  "#D6BCFA",
  "#BC85E0",
  "#7F9CF5",
  "#F6AD55",
  "#F687B3",
  "#68D391",
  "#FBBF24",
  "#4299E1",
];

export default function Avatar({ username = "", userId = "", avatarLink }) {

  const color = useMemo(() => {
    const idPart = userId?.slice(10) || "0";
    const num = parseInt(idPart, 16) || 0;
    return COLORS[num % COLORS.length];
  }, [userId]);

  const initial = username?.[0]?.toUpperCase() || "?";

  return (
    <div
      className="squircle relative text-black"
      style={{ "--squircle-bg-color": color }}
    >
      <div
        className="squircle__inline text-xl text-white uppercase"
        style={{ textShadow: "0.4px 0.4px 1px gray" }}
      >
        {avatarLink ? (
          <img
            src={avatarLink}
            alt={initial}
            loading="lazy"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      <style>
        {`
        .squircle {
          --squircle-size: 44px;
          --squircle-radii: 50% / 10%;
          aspect-ratio: 1;
          display: grid;
          width: var(--squircle-size);
        }

        .squircle::before,
        .squircle::after {
          content: "";
          grid-column: 1;
          grid-row: 1;
          justify-self: center;
          align-self: center;
          background-color: var(--squircle-bg-color, #6B8AFD);
          border-radius: var(--squircle-radii);
          width: 100%;
          height: 115%;
        }

        .squircle::after {
          transform: rotate(90deg);
        }

        .squircle__inline {
          position: absolute;
          inset: 5%;
          border-radius: 7%;
          display: grid;
          place-content: center;
          z-index: 1;
        }
        `}
      </style>
    </div>
  );
}
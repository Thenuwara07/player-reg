// src/components/Common/PlayerRow.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import type { User1 } from "@/types/playerViewDataTypes";
import { fmtAssoc, fmtClub } from "@/utils/formatters";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  player: User1 & { age?: number };
};

const statusClasses = (status?: string) => {
  switch ((status ?? "").toLowerCase()) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-800 ring-1 ring-amber-200";
    case "rejected":
      return "bg-rose-100 text-rose-800 ring-1 ring-rose-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
};

const PlayerRow: React.FC<Props> = ({ player }) => {
  const { user: authUser } = useAuth();

  const navigate = useNavigate();
  const p = player.player;

  // initials for fallback avatar
  const initials = `${player.firstName?.[0] ?? ""}${
    player.lastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <tr
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate("/player", { state: { userId: player.id } });
        }
      }}
      className="group cursor-pointer bg-white even:bg-slate-50/60 hover:bg-indigo-50/70 focus:bg-indigo-50/70 transition-colors "
      onClick={() => navigate("/player", { state: { userId: player.id } })}
      title="View player details"
    >
      {/* Name + avatar */}
      <td className="px-4 py-3 whitespace-nowrap rounded-md">
        <div className="flex items-center gap-3 max-w-[240px]">
          {player.profilePictureName ? (
            <img
              src={`${player.profilePictureName}`}
              alt={`${player.firstName} ${player.lastName}`}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-sm"
              loading="lazy"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-500 text-white grid place-items-center text-xs font-semibold shadow-sm">
              {initials || "U"}
            </div>
          )}
          <div className="flex-col">
            <span
              className=" text-slate-900 truncate text-sm font-medium"
              title={`${player.firstName} ${player.lastName}`}
            >
              {player.firstName} {player.lastName}
            </span>
            <p className="text-xs">{p?.slbfId ?? "-"}</p>
            <p>
              {" "}
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses(
                  player.status
                )}`}
              ></span>
            </p>
          </div>
        </div>
      </td>
      {authUser?.role === "admin" && (
        <>
          {/* Email */}
          <td className="px-4 py-3">
            <span
              className="block max-w-[220px] truncate text-slate-700 text-xs"
              title={player.email}
            >
              {player.email}
            </span>
          </td>

          {/* Contact */}
          <td className="px-4 py-3">
            <span className="text-slate-800 text-xs">{player.contact}</span>
          </td>
        </>
      )}

      {/* District */}
      <td className="px-4 py-3">
        <span
          className="block max-w-[140px] truncate text-slate-800 text-xs"
          title={player.district}
        >
          {player.district}
        </span>
      </td>

      {/* Age */}
      <td className="px-4 py-3 text-slate-800 text-xs">{player.age ?? "-"}</td>

      {/* Open / Close Associations */}
      <td className="px-4 py-3">
        <span
          className="block max-w-[180px] truncate text-slate-800 text-xs"
          title={fmtAssoc(p?.openAssociation) || "-"}
        >
          {fmtAssoc(p?.openAssociation) || "-"}
        </span>
        <span
          className="block max-w-[180px] truncate text-slate-800 text-xs"
          title={fmtClub(p?.openClub) || "-"}
        >
          {fmtClub(p?.openClub) || "-"}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className="block max-w-[180px] truncate text-slate-800 text-xs"
          title={fmtAssoc(p?.closeAssociation) || "-"}
        >
          {fmtAssoc(p?.closeAssociation) || "-"}
        </span>
        <span
          className="block max-w-[180px] truncate text-slate-800 text-xs"
          title={fmtClub(p?.closeClub) || "-"}
        >
          {fmtClub(p?.closeClub) || "-"}
        </span>
      </td>
    </tr>
  );
};

export default PlayerRow;

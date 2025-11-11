import {
  CellContext,
  ColumnDef,
  FilterFn,
  Row,
  Table,
} from "@tanstack/react-table";
import { ROLE } from "./filter";
import { Checkbox } from "@/components/ui/checkbox";

export const generateStatus = <TData extends object>(
  roles: Record<string, { text: string; bg: string; border: string }>,
): ColumnDef<TData, keyof TData> => ({
  accessorKey: "role",
  header: "Role",
  enableColumnFilter: true,
  filterFn: "includesString",
  cell: ({ row }: CellContext<TData, string>) => {
    const role = row.getValue("role");
    const roleStyles = roles[role as keyof typeof roles];

    return (
      <div className="flex items-center gap-1">
        <span
          className={`inline-block ${roleStyles.bg} ${roleStyles.text} ${roleStyles.border} border text-xs font-medium px-2.5 py-0.5 rounded-full`}
        >
          {role as string}
        </span>
      </div>
    );
  },
});

export const generateSelect = <TData extends object>() => ({
  id: "select",
  header: ({ table }: { table: Table<TData> }) => (
    <Checkbox
      id="select-all"
      checked={table.getIsAllRowsSelected()}
      onClick={table.getToggleAllRowsSelectedHandler()}
    />
  ),
  cell: ({ row }: { row: Row<TData> }) => (
    <Checkbox
      id="select-one"
      checked={row.getIsSelected()}
      onClick={row.getToggleSelectedHandler()}
    />
  ),
});

// export const generateTeams = <TData extends object>(teams: string[]) => ({
//   accessorKey: "team",
//   header: "Team",
//   enableColumnFilter: true,
//   cell: ({ row }: CellContext<TData, string[]>) => {
//     const value = row.getValue("team") as string[];
//     if (!Array.isArray(value)) return null;
//     return (
//       <div className="flex flex-wrap items-center gap-1">
//         {value.map((team) => {
//           const style = ROLE[team as keyof typeof ROLE] ?? {
//             text: "",
//             bg: "",
//             border: "",
//           };
//           return (
//             <span
//               key={team}
//               className={`inline-block ${style.bg} ${style.text} ${style.border} border text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full`}
//             >
//               {team}
//             </span>
//           );
//         })}
//       </div>
//     );
//   },
//   filterFn: includesStringArray,
// });

// const includesStringArray: FilterFn<string> = (row, columnId, filterValue) => {
//   const value = row.getValue(columnId) as string[];
//   return value.some((team) =>
//     team.toLowerCase().includes(filterValue.toLowerCase()),
//   );
// };

// export const generateSelect = <TData extends object>() => ({
//   id: "select",
//   cell: ({ row }: { row: Row<TData> }) => (
//     <Checkbox
//       id="select-one"
//       checked={row.getIsSelected()}
//       onClick={row.getToggleSelectedHandler()}
//     />
//   ),
//   meta: {
//     "text-align": "left",
//   },
// });

export type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: Date | string;
};
export const COLUMNS: (ColumnDef<Member, keyof Member> & {
  searchable?: boolean;
  accessorKey?: string;
})[] = [
  generateSelect(),
  {
    accessorKey: "name",
    header: "Name",
    searchable: true,
    enableColumnFilter: true,
    filterFn: "includesString",
    cell: (props: CellContext<Member, Member["name"]>) => (
      <div className="hover:cursor-pointer">{props.getValue()}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    searchable: true,
    enableColumnFilter: true,
    filterFn: "includesString",
    cell: (props: CellContext<Member, Member["email"]>) => (
      <div>{props.getValue()}</div>
    ),
  },
  //   {    accessorKey: "role",
  //     header: "Role",
  //     searchable: true,
  //     enableColumnFilter: true,
  //     filterFn: "includesString",
  //     cell: (props: CellContext<Team, Team["role"]>) => (
  //         <div>{props.getValue()}</div>
  //     ),
  //   },
  {
    accessorKey: "joinedAt",
    header: "Joined",
    searchable: true,
    enableColumnFilter: true,
    filterFn: "includesString",
    cell: (props: CellContext<Member, Member["joinedAt"]>) => {
      const date = props.getValue();
      const formattedDate =
        date instanceof Date
          ? date.toLocaleDateString()
          : new Date(date).toLocaleDateString();
      return <div>{formattedDate}</div>;
    },
  },
  // {
  //   accessorKey: "discord",
  //   header: "Discord",
  //   searchable: true,
  //   enableColumnFilter: true,
  //   filterFn: "includesString",
  //   cell: (props: CellContext<Team, Team["discord"]>) => (
  //     <div>{props.getValue()}</div>
  //   ),
  // },

  // generateTeams(Object.keys(TEAMS)),
  generateStatus(ROLE),
];

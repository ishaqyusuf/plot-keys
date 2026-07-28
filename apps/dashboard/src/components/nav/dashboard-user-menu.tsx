"use client";

import { Avatar, AvatarFallback } from "@plotkeys/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import Link from "next/link";

import { SignOut } from "./sign-out";

type Props = {
  companyName: string;
  userName: string;
  workRoleLabel: string;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function DashboardUserMenu({
  companyName,
  userName,
  workRoleLabel,
}: Props) {
  const initials = getInitials(userName) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          aria-label="Open user menu"
          className="rounded-full w-8 h-8 cursor-pointer bg-accent"
        >
          <AvatarFallback>
            <span className="text-xs">{initials}</span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" sideOffset={10} align="end">
        <DropdownMenuLabel>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="truncate line-clamp-1 max-w-[155px] block text-xs">
                {userName}
              </span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {companyName} - {workRoleLabel}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/settings">
          <DropdownMenuItem className="text-xs">Settings</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <SignOut />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

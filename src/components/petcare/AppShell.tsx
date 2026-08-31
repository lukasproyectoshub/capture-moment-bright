import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  Dog,
  LayoutDashboard,
  PawPrint,
  Package,
  ShoppingCart,
  Tags,
  Users,
  UserCog,
} from "lucide-react";
import type { ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/mascotas", label: "Mascotas", icon: Dog },
  { to: "/productos", label: "Productos", icon: Package },
  { to: "/categorias", label: "Categorías", icon: Tags },
  { to: "/ventas", label: "Ventas", icon: ShoppingCart },
  { to: "/empleados", label: "Empleados", icon: UserCog },
  { to: "/reportes", label: "Reportes", icon: BarChart3 },
] as const;

function PetSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-accent shadow-glow">
            <PawPrint className="size-5 text-accent-foreground" />
          </span>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-lg leading-tight font-bold">PETCARE</p>
            <p className="truncate text-xs text-sidebar-foreground/70">Gestión de PetShop</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link to={item.to}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="rounded-xl bg-sidebar-accent/60 p-3 group-data-[collapsible=icon]:hidden">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Boxes className="size-4" /> Sucursal Centro
          </p>
          <p className="mt-1 text-xs text-sidebar-foreground/70">
            Conectado a la API REST de PETCARE
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string | undefined;
  actions?: ReactNode | undefined;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <PetSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b bg-card/85 px-4 py-3 backdrop-blur md:px-6">
          <SidebarTrigger className="shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold md:text-2xl">{title}</h1>
            {description ? (
              <p className="truncate text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </header>
        <main className="flex-1 space-y-6 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

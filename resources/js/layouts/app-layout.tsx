import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <Toaster toastOptions={{
            classNames: {
                title: "!font-bold",
                description: "!text-[var(--color-popover-foreground)]",
            closeButton: "hover:!bg-primary hover:!border-none"
            },
        }}/>
        {children}
    </AppLayoutTemplate>
);

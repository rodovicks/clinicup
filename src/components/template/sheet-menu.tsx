import Link from 'next/link';
import { Activity, MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Menu } from '@/components/template/menu';
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/home" className="flex items-center gap-2">
              <Activity className="w-6 h-6 mr-1 text-sky-500" />
              <SheetTitle className="font-bold text-lg text-sky-500">
                Clinic Up
              </SheetTitle>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}

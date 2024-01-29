// import { Navbar } from "./_components/navbar";

// interface ProtectedLayoutProps {
//     children: React.ReactNode;
// };

// const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
//   return (
//     <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
//     from-sky-400 to-blue-800">
//         <Navbar />
//       {children}
//     </div>
//   );
// }

// export default ProtectedLayout;

import { MenuBar } from '@/components/MenuBar';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { useCheckIfRequiredFieldsArePopulated } from '@/hooks/useCheckIfRequiredFieldsArePopulated';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This runs only once on the initial load of this layout
  // e.g. when the user signs in/up or on hard reload
  await useCheckIfRequiredFieldsArePopulated();

  return (
    <div className="md:flex md:justify-center md:gap-2">
      <MenuBar />

      <ResponsiveContainer className="pb-20 md:pb-4">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
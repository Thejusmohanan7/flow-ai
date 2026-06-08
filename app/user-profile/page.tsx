// app/user-profile/page.tsx
import { UserButton } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="p-8">
      <UserButton />
    </div>
  );
}
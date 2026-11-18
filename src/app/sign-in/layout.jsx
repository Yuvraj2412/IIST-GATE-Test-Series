import "../globals.css";

export const metadata = {
  title: "Sign In - IGTS | Dhanak 2k27",
  description:
    "IGTS - Dhanak 2k27 is the official GATE 2027 Mock Test Series organised by the students of Indian Institute of Space Science and Technology (IIST), Thiruvananthapuram.",
  icons: {
    icon: "/images/icon.png", // /public path
  },
  url: "https://igts.dhanakiist.co.in",
  type: "website",
  siteName: "IGTS - Dhanak 2k27",
};

export default function SignInLayout({ children }) {
  return (
    <section>{children}</section>
  );
}

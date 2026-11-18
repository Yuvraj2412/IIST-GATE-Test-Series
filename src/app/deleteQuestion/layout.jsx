export const metadata = {
    title: "Delete Questions - IGTS | Dhanak 2k27",
    description:
      "IGTS - Dhanak 2k27 is the official GATE 2027 Mock Test Series organised by the students of Indian Institute of Space Science and Technology (IIST), Thiruvananthapuram.",
    icons: {
      icon: "/images/icon.png", // /public path
    },
    url: "https://igts.dhanakiist.co.in",
    type: "website",
    siteName: "IGTS - Dhanak 2k27",
  };

export default function DeleteQuestionLayout({ children }) {
    return (
        <section>{children}</section>
    );
}

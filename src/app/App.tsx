import { MainLayout } from "@/layouts/MainLayout";
import { HomePage } from "@/pages/HomePage";
import "@/styles/index.css";

export default function App() {
  return (
    <MainLayout>
      <HomePage />
    </MainLayout>
  );
}

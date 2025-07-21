import Image from "next/image";
import AzurePage from "./Azure/page";












// dispatch(getAzureData({
//   page: 1,
//   limit: 25,
//   armRegionName: "westus,eastus",
// }));

export default function Home() {
  return (
    <>
      <AzurePage />
    </>
  );
}

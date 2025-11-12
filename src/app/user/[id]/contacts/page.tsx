import Index from "@/components/contacts";

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <Index id={params.id} />
    </div>
  );
};

export default Page;

import SlideEditor from "./_components/slide-editor";
import SlideList from "./_components/slide-list";

const QuestionPage = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-4">
        <SlideList />
      </div>
      <div className="col-span-8">
        <SlideEditor />
      </div>
    </div>
  );
};

export default QuestionPage;

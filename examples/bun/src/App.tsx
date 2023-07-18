import { tw } from "tw-lite";

function MyComponent({
  className,
  someProp,
}: {
  className?: string;
  someProp: boolean;
}) {
  return (
    <div className={className}>My Component {someProp ? "true" : "false"}</div>
  );
}

const StyledMyComponent = tw(MyComponent)`text-red-500`;

export const Column = tw("div")`flex flex-col gap-4 w-64 mx-auto`;
export const Button = tw("button")`p-4 rounded-sm`;
export const ButtonRed = tw(Button)`bg-red-700 text-white`;
export const ButtonBlue = tw(Button)`bg-blue-700 text-white`;

export function App() {
  return (
    <Column>
      <ButtonRed>Hello Red</ButtonRed>
      <ButtonBlue>Hello Blue</ButtonBlue>
      <ButtonBlue className="text-xl p-8">Hello Blue big</ButtonBlue>
      <StyledMyComponent someProp={true} />
      <StyledMyComponent someProp={false} />
    </Column>
  );
}

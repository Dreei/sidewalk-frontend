import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const getRandomColor = () => {
  const colors = ["#0096c7"]; // Add any four colors you want
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const MarkdownRenderer = ({ markdown }) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        p: () => null,
        h1: () => null,
        h2: () => null,
        h3: () => null,
        h4: () => null,
        ul: ({ children }) => (
          <div
            style={{
              border: "2px solid #d1d1d1",
              backgroundColor: getRandomColor(), // Random background color
              color: "#fff", // White text color
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ul>{children}</ul>
          </div>
        ),
        ol: ({ children }) => (
          <div
            style={{
              border: "2px solid #d1d1d1",
              backgroundColor: getRandomColor(), // Random background color
              color: "#fff", // White text color
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ol>{children}</ol>
          </div>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;

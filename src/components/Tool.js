export default function Tool({ tool }) {

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">{tool.tool}</h3>
        <a 
          href={tool.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-green-dark hover:text-blue-800 font-medium mb-3 block"
        >
          Bezoek website
        </a>
        <p className="text-gray-600 mb-4 line-clamp-3">{tool.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {tool.subject.split(',').map((subject, idx) => (
            <span 
              key={idx} 
              className="bg-background text-green-dark px-3 py-1 rounded-full text-sm font-medium"
            >
              {subject.trim()}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Toegevoegd op: {tool.date}</span>
          {tool.rating !== "" ? (
            <span className="text-yellow-500">
              {'★'.repeat(tool.rating)}{'☆'.repeat(5 - tool.rating)}
            </span>
          ) : (
            <span className="text-sm text-gray-500">Nog niet getest</span>
          )}
        </div>
      </div>
    </div>
  );
} 
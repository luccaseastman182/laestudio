import React, { useState } from 'react';

type ProjectSaveLoadProps = {
  onSave: (projectData: any) => void;
  onLoad: (projectData: any) => void;
};

const ProjectSaveLoad: React.FC<ProjectSaveLoadProps> = ({ onSave, onLoad }) => {
  const [projectData, setProjectData] = useState<any>(null);

  const handleSave = () => {
    onSave(projectData);
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const parsedData = JSON.parse(data as string);
          setProjectData(parsedData);
          onLoad(parsedData);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="project-save-load">
      <button onClick={handleSave}>Save Project</button>
      <input type="file" accept=".json" onChange={handleLoad} />
    </div>
  );
};

export default ProjectSaveLoad;

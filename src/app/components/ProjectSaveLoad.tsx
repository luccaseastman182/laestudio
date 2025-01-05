import React, { useState } from 'react';

type ProjectData = {
  id: string;
  name: string;
  tracks: any[]; // Replace 'any' with a more specific type if available
};

type ProjectSaveLoadProps = {
  onSave: (projectData: ProjectData) => void;
  onLoad: (projectData: ProjectData) => void;
};

const ProjectSaveLoad: React.FC<ProjectSaveLoadProps> = ({ onSave, onLoad }) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  const handleSave = () => {
    if (projectData) {
      onSave(projectData);
    }
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const parsedData: ProjectData = JSON.parse(data as string);
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

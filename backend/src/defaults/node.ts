export const baseNodePrompt = `
<boltArtifact id="project-import" title="Project Files">
  <boltAction type="file" filePath="index.js">
    // run \`node index.js\` in the terminal
    console.log(\`Hello Node.js v\${process.versions.node}!\`);
  </boltAction>

  <boltAction type="file" filePath="package.json">
    {
      "name": "node-starter",
      "private": true,
      "scripts": {
        "test": "echo \\"Error: no test specified\\" && exit 1"
      }
    }
  </boltAction>
</boltArtifact>
`;

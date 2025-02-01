export const baseNodePrompt = `
<ignixArtifact id="project-import" title="Project Files">
  <ignixAction type="file" filePath="index.js">
    // run \`node index.js\` in the terminal
    console.log(\`Hello Node.js v\${process.versions.node}!\`);
  </ignixAction>

  <ignixAction type="file" filePath="package.json">
    {
      "name": "node-starter",
      "private": true,
      "scripts": {
        "test": "echo \\"Error: no test specified\\" && exit 1"
      }
    }
  </ignixAction>
</ignixArtifact>
`;

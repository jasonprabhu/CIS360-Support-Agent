const fs = require('fs');
const path = require('path');

const fixTypes = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/import \{ ([^}]+) \} from '\.\/types';/g, "import type { $1 } from './types';");
  content = content.replace(/import React, \{([^}]+)\} from 'react';/, "import { $1 } from 'react';\nimport type { ReactNode } from 'react';");
  // Also fix IdentityDataProvider ReactNode
  content = content.replace("import { createContext, useContext, useState, useEffect, ReactNode } from 'react';\nimport type { ReactNode } from 'react';", "import { createContext, useContext, useState, useEffect } from 'react';\nimport type { ReactNode } from 'react';");
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed ' + filePath);
};

const servicesDir = path.join(__dirname, 'src', 'services', 'identityIntelligence');
fixTypes(path.join(servicesDir, 'MockProvider.ts'));
fixTypes(path.join(servicesDir, 'ProductionProvider.ts'));
fixTypes(path.join(servicesDir, 'IdentityDataProvider.tsx'));

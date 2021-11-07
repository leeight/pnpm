import path from 'path'
import PnpmError from '@pnpm/error'
import { WORKSPACE_MANIFEST_FILENAME } from '@pnpm/constants'
import findUp from 'find-up'

const WORKSPACE_DIR_ENV_VAR = 'NPM_CONFIG_WORKSPACE_DIR'

export default async function findWorkspaceDir (cwd: string) {
  const workspaceManifestDirEnvVar = process.env[WORKSPACE_DIR_ENV_VAR] ?? process.env[WORKSPACE_DIR_ENV_VAR.toLowerCase()]
  const workspaceManifestLocation = workspaceManifestDirEnvVar
    ? path.join(workspaceManifestDirEnvVar, WORKSPACE_MANIFEST_FILENAME)
    : await findUp([WORKSPACE_MANIFEST_FILENAME, 'pnpm-workspace.yml'], { cwd })
  if (workspaceManifestLocation?.endsWith('.yml')) {
    throw new PnpmError('BAD_WORKSPACE_MANIFEST_NAME', `The workspace manifest file should be named "pnpm-workspace.yaml". File found: ${workspaceManifestLocation}`)
  }
  return workspaceManifestLocation && path.dirname(workspaceManifestLocation)
}

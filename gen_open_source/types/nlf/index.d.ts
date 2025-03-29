interface NlfFindOptions {
  directory: string;
  reach?: 1;
  production?: boolean;
}

interface NlfNpmPackage {
  id: string;
  name: string;
  version: string;
  repository: string;
  directory: string;
  licenseSources: {
    package: {
      sources: Array<{
        license: string;
        url: string;
      }>;
    };
    license: {
      sources: Array<{
        filePath: string;
        text: string;
        names(): string?;
      }>;
    };
    readme: {
      sources: Array<{
        filePath: string;
        text: string;
        names(): string?;
      }>;
    };
  };
}

type NlfFindCallback = (err: any, data: NlfNpmPackage[]) => void;

export interface NlfType {
  find(options: NlfFindOptions, callback: NlfFindCallback): void;
}

var Nlf: NlfType;
declare module "nlf" {
  export = Nlf;
}

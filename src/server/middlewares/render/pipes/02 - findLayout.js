const path = require('path');
const Url = require('url-parse');

const mapKeysDeep = require('deepdash/mapKeysDeep');
const pickDeep = require('deepdash/pickDeep');
const findValueDeep = require('deepdash/findValueDeep');

const getFolderName = pathTo => {
  let vf = pathTo.split(path.sep).slice(-1);
  vf = vf.pop();
  vf = vf == '_' ? '/' : vf;
  vf = vf.split('.')[0];
  return vf;
};

const findPathDeepFromAttrs = (object, interatee) => {};

let defaultRoutes = [
  {
    path: '/',
    folder: ''
  },
  {
    path: '/Produto/',
    folder: '/Produto/@Produto@'
  },
  {
    path: '/departamento/',
    folder: '/Departamento/@departamento@'
  },
  {
    path: '/categoria/',
    folder: '/Categoria/@categoria@'
  }
];

const pickInDataTree = (tree, pathTo) => {
  const dataTreeWithKeys = mapKeysDeep(tree, i => i.name, {
    childrenPath: 'children'
  });

  return pickDeep(dataTreeWithKeys, pathTo.replace(/\//, '.'), {
    childrenPath: 'children',
    onNotMatch: {
      cloneDeep: false,
      skipChildren: true,
      keepIfEmpty: false
    }
  });
};

module.exports = async args => {
  const { request, website } = args;

  const url = new Url(request.url);

  let folder, layout, routeForFolder;

  let matchDefaultRoutes = defaultRoutes.find(
    r => r.path.indexOf(url.pathname) == 0
  );

  // console.log({ matchDefaultRoutes });

  if (matchDefaultRoutes) {
    if (matchDefaultRoutes.folder == '') {
      folder = website.children;
      layout = website.children.find(
        x => x.active && x.default && x.type == 'layout'
      );
    } else {
      folder = findValueDeep(
        website.children,
        i => {
          return (
            i.path ==
              path.join(
                website.path,
                '..',
                'routes',
                matchDefaultRoutes.folder
              ) && i.type == 'directory'
          );
        },
        { childrenPath: 'children', leavesOnly: true }
      );

      layout = folder.children.find(
        x => x.active && x.default && x.type == 'layout'
      );
    }
  } else {
    // folder = findValueDeep(
    //   website.children,
    //   i => i.path == path.resolve(website.path, '../_', url.pathname),
    //   { childrenPath: 'children' }
    // );
    // layout = folder.children.find(
    //   x => x.active && x.default && x.type == 'layout'
    // );
  }

  layout.virtualFolder = getFolderName(layout.path);

  // console.log({ folder, layout });

  return {
    ...args,
    layout
  };

  // const redirects = JSONC.parse(
  //   await readFileSync(
  //     path.join(global.VTEXY.dataPath, 'redirects.jsonc'),
  //     'utf8'
  //   )
  // );

  // const isRedirectPath = redirects.find(redirect => {
  //   let path = redirect.path.split('/');

  //   path['{}'];
  // });
  // const isDefaultRoute = defaultRoutes.find(route => ~url.pathname.indexOf(route.path));

  // Respecting path
  // if (existsSync(folder)) {
  //   // let layouts = await glob.sync(path.join(folder, '!(_).jsonc'));

  //   if (layouts.filter(x => x.active && x.default).length > 1) {
  //     throw 'There cannot be more than one default page. ' +
  //       `(Path: ${folder})`;
  //   }

  //   let layout = layouts.find(x => x.active && x.default);

  //   layout.virtualFolder = getFolderName(folder);

  //   return {
  //     ...args,
  //     layout
  //   };
  // }
};

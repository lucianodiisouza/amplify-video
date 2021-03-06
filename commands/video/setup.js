const subcommand = 'setup';
const category = 'video';

module.exports = {
  name: subcommand,
  run: async (context) => {
    const { amplify } = context;
    const amplifyMeta = amplify.getProjectMeta();

    if (!(category in amplifyMeta) || Object.keys(amplifyMeta[category]).length === 0) {
      context.print.error(`You have no ${category} projects.`);
      return;
    }

    const chooseProject = [
      {
        type: 'list',
        name: 'resourceName',
        message: 'Choose what project you want to setup s3 for?',
        choices: Object.keys(amplifyMeta[category]),
        default: Object.keys(amplifyMeta[category])[0],
      },
    ];

    const props = await context.prompt.ask(chooseProject);

    const options = amplifyMeta.video[props.resourceName];

    const providerController = require(`../../provider-utils/${options.providerPlugin}/index`);
    if (!providerController) {
      context.print.error('Provider not configured for this category');
      return;
    }
    /* eslint-disable */
    return providerController.setupCloudFormation(context, options.serviceType, options, props.resourceName);
    /* eslint-enable */
  },
};

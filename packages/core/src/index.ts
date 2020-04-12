import { rootFolder } from '@webpack-multi/constants';
import { WebpackMultiOptions } from '@webpack-types/classes';
export function bootstrap(options: WebpackMultiOptions) {
	const watch = !!options.watch;
	const watchOptions = watch ? typeof options.watch === 'object' ? options.watch : {} : null;
	process.env.ROOT_DIR = options.rootDir || rootFolder();
}

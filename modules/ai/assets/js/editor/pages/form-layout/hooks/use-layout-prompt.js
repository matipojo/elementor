import { generateLayout } from '../../../api';
import usePrompt from '../../../hooks/use-prompt';

const useLayoutPrompt = ( type, initialValue ) => {
	return usePrompt( ( prompt, attachments, signal ) => generateLayout( prompt, attachments, type, signal ), initialValue );
};

export default useLayoutPrompt;

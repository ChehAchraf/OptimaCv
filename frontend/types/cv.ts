
import { CVFullProfile } from './cv-builder';

export interface CVData extends CVFullProfile {
    id: string;
    user_id: string;
    title?: string;
    created_at?: string;
    updated_at?: string;
}

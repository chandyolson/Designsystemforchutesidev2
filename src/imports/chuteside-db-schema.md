CHUTESIDE SOLUTIONS — DATABASE SCHEMA (29 tables)

GROUP 1: AUTH & TENANCY
operations: id uuid, operation_name text, owner_name text, email text, phone text, address text, city text, state text, zip text, operation_type text (ranch|vet_practice), is_placeholder bool, claimed_by uuid, claimed_at timestamp
operation_teams: id uuid, operation_id uuid→operations, user_id uuid→auth.users, user_type text (admin|operator|veterinarian|operation_member|operation_guest), email text, phone text, is_active bool
vet_practices: id uuid, vet_operation_id uuid→operations, ranch_operation_id uuid→operations
pending_invitations: id uuid, operation_id uuid→operations, invited_email text, invited_role text, token text, status text (pending|accepted|expired|revoked), invited_by uuid, expires_at timestamp
user_profiles: id uuid, user_id uuid→auth.users, display_name text, phone text, avatar_url text

GROUP 2: ANIMALS
animals: id uuid, operation_id uuid→operations, tag text, tag_color text, eid text, sex text (Bull|Cow|Steer|Spayed Heifer), animal_type text (Calf|Feeder|Replacement|Cow|Bull), breed text, year_born int, dob date, status text (Active|Dead|Sold), name text, registration_name text, registration_number text, association_id uuid, grafted_to_dam_id uuid→animals, graft_date date, graft_reason text, notes text
animal_ids: id uuid, operation_id uuid, animal_id uuid→animals, id_type text, id_value text
animal_flags: id uuid, operation_id uuid, animal_id uuid→animals, flag_type text (management|production|cull), reason text, note text, is_active bool, flagged_at timestamp, cleared_at timestamp, cleared_by uuid
status_changes: id uuid, operation_id uuid, animal_id uuid→animals, old_status text, new_status text, reason text, change_date date, notes text, changed_by uuid
id_history: id uuid, operation_id uuid, animal_id uuid→animals, field_changed text, old_value text, new_value text, changed_by uuid, changed_at timestamp

GROUP 3: CALVING & SIRES
calving_records: id uuid, operation_id uuid, dam_id uuid→animals, calf_id uuid→animals, sire_id uuid→animals, calving_date date, calf_status text (Alive|Dead), calf_sex text, calf_tag text, calf_tag_color text, birth_weight numeric, disposition int(1-6), assistance int(1-5), udder_score int(1-9), teat_score int(1-9), claw_score int(1-9), foot_score int(1-9), mothering_score int(1-5), calf_vigor int(1-5), calf_size int(1-5), notes text, recorded_by uuid
sire_details: id uuid, operation_id uuid, animal_id uuid→animals, sire_type text, pedigree_data jsonb, purchase_history jsonb, notes text

GROUP 4: PROJECTS & CHUTESIDE WORK
project_templates: id uuid, operation_id uuid, name text, work_type_code text, cattle_type text, default_fields jsonb, default_products jsonb, notes text, is_active bool
projects: id uuid, operation_id uuid, template_id uuid→project_templates, name text, work_type_code text (PREG|AI|BSE|BV|PRE|WN|SALE|TX|PROCESS), cattle_type text, project_date date, location_id uuid→locations, group_id uuid→groups, head_count int, status text (Pending|In Progress|Completed), products jsonb, notes text, created_by uuid
project_animal_records: id uuid, operation_id uuid, project_id uuid→projects, animal_id uuid→animals, weight numeric, notes text, data_1 text, data_2 text, lot text, sample_id text, data jsonb, soundness_exam_id uuid→soundness_exams, recorded_by uuid
cow_work_quick_notes: id uuid, operation_id uuid, project_animal_record_id uuid→project_animal_records, quick_note_id uuid→quick_notes

GROUP 5: TREATMENTS & PRODUCTS
treatments: id uuid, operation_id uuid, animal_id uuid→animals, treatment_date date, disease_type text, notes text, administered_by uuid
treatment_products: id uuid, operation_id uuid, treatment_id uuid→treatments, product_id uuid→products, quantity numeric, dose text, withdrawal_date date
products: id uuid, name text, product_type text (Vaccine|Antibiotic|Supplement|Anthelmentic|Synchronization Drug|Growth Promotant Implant|Feed Additive|Anti-inflammatory|Service|Supply), manufacturer text, withdrawal_days int, route text[] (SubQ|IM|IV|Oral|Topical|Pour-On), image_url text, description text
operation_products: id uuid, operation_id uuid→operations, product_id uuid→products, price numeric, is_preferred bool, custom_dose text, notes text

GROUP 6: BSE
soundness_exams: id uuid, operation_id uuid, animal_id uuid→animals, exam_date date, pass_fail text (Pass|Fail|Marginal|Deferred|Permanent Fail), scrotal_circ numeric, motility_pct int, morphology_pct int, quality text, motility_desc text (Excellent|Very Good|Good|Poor|No Motility), physical_defects text[], semen_defects text[], notes text, examined_by uuid

GROUP 7: LOOKUPS & CONFIG
groups: id uuid, operation_id uuid, name text, type text, start_date date, end_date date, is_active bool, notes text
animal_groups: id uuid, operation_id uuid, animal_id uuid→animals, group_id uuid→groups, start_date date, end_date date
locations: id uuid, operation_id uuid, name text, type text (Farm|Ranch|Pasture|Pen|Lot|Working Facility|Water Source|Other), parent_id uuid→locations, lat numeric, lng numeric, notes text
quick_notes: id uuid, operation_id uuid, note_text text, note_type text (Calving Notes|Cow Notes|Project Notes), sort_order int, is_active bool
diseases: id uuid, name text
operation_preferences: id uuid, operation_id uuid→operations, use_year_tag_system bool, preferred_preg_stages text[], preferred_breeds text[], preferred_diseases text[], lifetime_id_prefix text, lifetime_id_pattern text, lifetime_id_next_seq int

GROUP 8: RED BOOK
redbook_entries: id uuid, operation_id uuid, title text, body text, category text (Invoice/Receipt|Cattle Note|Computer Document|Repairs), pinned bool, created_by uuid
redbook_attachments: id uuid, operation_id uuid, entry_id uuid→redbook_entries, file_type text (image|video|audio|document), file_url text, file_name text, file_size int, duration int
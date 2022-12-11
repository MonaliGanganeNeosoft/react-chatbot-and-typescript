import { Gender, LanguagePreference, DashboardView } from 'src/constants';
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'employees' })
export class EmployeeEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ type: 'varchar', name: 'pbs_id', nullable: true })
    pbsId: string;

    @Column({
        type: 'varchar',
        name: 'pbs_employee_id',
        nullable: true,
        unique: true,
    })
    pbsEmployeeId: string;

    @Column({
        name: 'is_enrolled',
        type: 'boolean',
        default: false,
    })
    isEnrolled: boolean;

    @Column({
        name: 'image_url',
        nullable: true,
    })
    imageUrl: string;

    @Column({
        name: 'image_key',
        nullable: true,
    })
    imageKey: string;

    // @Column({ type: 'varchar', name: 'serial_number', nullable: true })
    // serialNumber: string;

    @Column({
        name: 'gender',
        nullable: true,
        enum: [Gender.MALE, Gender.FEMALE, Gender.NO_WISH],
    })
    gender: string;

    @Column({ name: 'omvic_license', nullable: true })
    omvicLicense: string;

    @Column({
        name: 'omvic_license_expiry',
        nullable: true,
        length: 10,
    })
    omvicLicenseExpiry: string;

    @Column({
        name: 'is_license_inprogress',
        type: 'boolean',
        default: false,
    })
    isLicenseInProgress: boolean;

    @Column({ type: 'varchar', name: 'first_name', nullable: true })
    firstName: string;

    @Column({ type: 'varchar', name: 'last_name', nullable: true })
    lastName: string;

    @Column({ type: 'varchar', name: 'preferred_name', nullable: true})
    preferredName: string;

    @Column({ type: 'varchar', name: 'email', nullable: true })
    email: string;

    @Column({ name: 'communication_email', nullable: true })
    communicationEmail: string;

    @Column({ name: 'calendar_url', nullable: true })
    calendarUrl: string;

    @Column({ name: 'slug', nullable: true })
    slug: string;

    @Column({ name: 'birth_date', nullable: true })
    birthDate: string;

    @Column({ type: 'varchar', name: 'phone', nullable: true })
    phone: string;

    @Column({ type: 'varchar', name: 'phone_extension', nullable: true })
    phoneExtension: string;

    @Column({ name: 'assigned_phone_number', nullable: true, update: true })
    assignedPhoneNumber: string;

    @Column({ type: 'boolean', name: 'is_inactive', default: false })
    isInactive: boolean;

    @Column({ type: 'boolean', name: 'is_visible', default: false })
    isVisible: boolean;

    @Column({ name: 'source', default: 'PORTAL', nullable: true })
    source: string;

    @Column({ name: 'daily_limit', default: 0, nullable: true })
    dailyLimit: number;

    @Column({ name: 'monthly_limit', default: 0, nullable: true })
    monthlyLimit: number;

    @Column({ type: 'varchar', name: 'last_pbs_update', nullable: true })
    pbsLastUpdate: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    /** extra pbs data */

    @Column({ type: 'varchar', name: 'pbs_username', nullable: true })
    pbsUserName: string;

    @Column({ type: 'boolean', name: 'is_sales', default: false })
    isSales: boolean;

    @Column({ type: 'varchar', name: 'salesman_number', nullable: true })
    salesmanNumber: string;

    @Column({ type: 'varchar', name: 'pbs_sales_role', nullable: true })
    pbsSalesRole: string;

    @Column({ type: 'boolean', name: 'is_fixed_ops', default: false })
    isFixedOps: boolean;

    @Column({ type: 'varchar', name: 'fixedops_employee_number', nullable: true })
    fixedOpsEmployeeNumber: string;

    @Column({ type: 'varchar', name: 'fixedops_role', nullable: true })
    fixedOpsRole: string;

    @Column({ type: 'boolean', name: 'is_technician', default: false })
    isTechnician: boolean;

    @Column({ type: 'varchar', name: 'technician_number', nullable: true })
    technicianNumber: string;

    @Column({ type: 'varchar', name: 'manufacturer_id', nullable: true })
    manufacturerID: string;

    @Column({ type: 'varchar', name: 'default_shop', nullable: true })
    defaultShop: string;

    @Column({ type: 'varchar', name: 'call_track_pin', nullable: true })
    callTrakPin: string;

    @Column({ type: 'boolean', name: 'is_contact_enabled', default: false })
    isConnectEnabled: boolean;

    @Column({ type: 'boolean', name: 'is_doc_signing_enabled', default: false })
    isDocSigningEnabled: boolean;

    @Column({ type: 'boolean', name: 'is_shuttle_driver', default: false })
    isShuttleDriver: boolean;

    @Column({
        type: 'boolean',
        name: 'is_mobile_service_arrival',
        default: false,
    })
    isMobileServiceArrival: boolean;

    @Column({
        type: 'varchar',
        name: 'mobile_service_arrival_access',
        nullable: true,
    })
    mobileServiceArrivalAccess: number;

     /** extra profile data */

    @Column({ type: 'boolean', name: 'themes', default: true })
    themes: boolean;

    @Column({ type: 'boolean', name: 'lead_details_view', default: true })
    leadDetailsView: boolean;

    @Column({ type: 'boolean', name: 'master_calendar_view', default: true })
    masterCalendarView: boolean;

    @Column({ name: 'no_of_records_show', default: 10, nullable: true })
    noOfRecordsShow: number;

    @Column({
        name: 'language_preference',
        default: LanguagePreference.EN,
        nullable: false,
        enum: [LanguagePreference.EN, LanguagePreference.FR, LanguagePreference.NO_WISH],
    })
    languagePreference: string;

    @Column({
        name: 'default_dashboard_view',
        default: DashboardView.AGENT,
        nullable: false,
        enum: [DashboardView.AGENT, DashboardView.NO_WISH],
    })
    defaultDashboardView: string;

    @Column({ type: 'boolean', name: 'default_newsletter', default: true })
    defaultNewsletter: boolean;

    @Column({ type: 'boolean', name: 'default_release_notes', default: false })
    defaultReleaseNotes: boolean;

    @BeforeInsert()
    beforeInsert() {
        if (this.email) this.email = this.email.toLowerCase();
    }
}

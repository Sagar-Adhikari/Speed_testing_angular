export interface IComplain{
    id?: number;
    site: number;
    averageLatency: number;
    averageJitter: number;
    packetLoss: number;
    maximumDownloadRate: number;
    averageDownloadRate: number;
    loadedDownloadLatency: number;
    loadedDownloadJitter: number;
    dataDownloadSuccessRate: number;
    maximumUploadRate: number;
    averageUploadRate: number;
    loadedUploadLatency: number;
    loadedUploadJitter: number;
    dataUploadSuccessRate: number;
    browsingDelay: number;
    browsingSuccessRate: number;
    internetServiceProvider: string;
    location: string;
    lat: number;
    lng: number;
    clientName: string;
    bandWidth: number;
    mobileNo: string;
    email: string;
    created_at?: Date;
    

}
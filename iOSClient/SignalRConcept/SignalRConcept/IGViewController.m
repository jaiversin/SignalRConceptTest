//
//  IGViewController.m
//  SignalRConcept
//
//  Created by Jhon Lopez on 2/7/14.
//  Copyright (c) 2014 Intergrupo. All rights reserved.
//

#import "IGViewController.h"


@interface IGViewController ()

@property (weak, nonatomic) IBOutlet UITextField *textMessageTextField;
@property (weak, nonatomic) IBOutlet UITextView *messagesTextView;

@property (nonatomic, strong) SRConnection *connection;
@property (nonatomic, strong) SRHubConnection *hubConnection;
@property (nonatomic, strong) SRHubProxy *chat;

@end

@implementation IGViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    
    __weak typeof (self) weakSelf = self;
    
//    self.chat = [self.connection createHubProxy:@"Chat"];
//    
//    [self.chat on:@"addNewMessageToPage" perform:self selector:@selector(addMessage:fromName:)];
//    //[self.chat on:@"sendMeMessage" perform:self selector:@selector(sendMeMessage:message:)];
//    
//    self.connection.received = ^(NSString * data) {
//        weakSelf.messagesTextView.text = [weakSelf.messagesTextView.text stringByAppendingString:weakSelf.messagesTextView.text];
//    };
//    self.connection.started =  ^{
////        [self.connection send:@{}];
//    };
//    
//    
//    [self.connection setDelegate:self];
//    
//    [self.connection start];
    
    
//    // Connect to the service
    self.hubConnection = [SRHubConnection connectionWithURL:@"http://10.60.6.27/chat/signalr/hubs"];
    // Create a proxy to the chat service
    self.chat = [self.hubConnection createHubProxy:@"ChatHub"];
    
    [self.chat on:@"addNewMessageToPage" perform:self selector:@selector(fromName:message:)];
    // Start the connection
    [self.hubConnection start];
    
    
//    NSString *server = @"http://10.60.6.27/chat/signalr/hubs/";
////    server = [server stringByAppendingFormat:@"raw-connection"];
//    
//    self.connection = [SRConnection connectionWithURL:server];
//    
//    self.connection.delegate = self;
//    [self.connection start];
    
    
//    [self.connection.transport setDefaultHeader:@"Accept" value:@"application/json"];
    
//    self.connection.received = ^(NSString * data) {
//        NSLog(data);
//    };
//    self.connection.started =  ^{
//        [weakSelf.connection send:@"hello world"];
//    };
    
    
    
    
    
}

- (void)fromName:(NSString *)name message:(NSString *)message {
    // Print the message when it comes in
    
    NSString *messageWithName = [NSString stringWithFormat:@"%@: %@ \n",name,message];
    
    self.messagesTextView.text = [self.messagesTextView.text stringByAppendingString:messageWithName];
    
}


//-(SRHubConnection *)connection
//{
//    if (!_connection) {
//        _connection = [SRHubConnection connectionWithURL:@"http://10.60.6.27/chat/signalr/hubs"];
//        
//    }
//    return _connection;
//}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)addMessage:(id)message fromName:(id)name
{
    
//    NSString *messageWithName = [NSString stringWithFormat:@"%@: %@ \n",name,message];
//    
//    self.messagesTextView.text = [self.messagesTextView.text stringByAppendingString:messageWithName];
    
    
}

- (IBAction)sendMessage:(id)sender {
    
    
    
    [self.chat invoke:@"Send" withArgs:@[@"yo", self.textMessageTextField.text]];
    NSString *messageWithName = [NSString stringWithFormat:@"%@: %@ \n",@"Yo",self.textMessageTextField.text];
    
//    self.messagesTextView.text = [self.messagesTextView.text stringByAppendingString:messageWithName];
    
    self.textMessageTextField.text = @"";
    
//    [self.connection send:@[@"yo", messageWithName] completionHandler:^(id response, NSError *error) {
//        NSLog(response);
//    }];
    

}


- (void)sendMeMessage:(id)name message:(id)message
{
    NSString *messageWithName = [NSString stringWithFormat:@"%@: %@ \n",name,message];
    
    self.messagesTextView.text = [self.messagesTextView.text stringByAppendingString:messageWithName];
}

- (void)SRConnectionDidOpen:(SRConnection *)connection
{
    
    NSLog(@"SRConnectionDidOpen");
//    [messagesReceived insertObject:@"Connection Opened" atIndex:0];
//    [hub invoke:@"Join" withArgs:@[]];
//    [messageTable reloadData];
}

- (void)SRConnection:(SRConnection *)connection didReceiveData:(id)data
{
    NSLog(@"SRConnection");
    //[messagesReceived insertObject:data atIndex:0];
    //[messageTable reloadData];
}

- (void)SRConnectionDidClose:(SRConnection *)connection
{
    NSLog(@"SRConnectionDidClose");
//    [messagesReceived insertObject:@"Connection Closed" atIndex:0];
//    [messageTable reloadData];
}

- (void)SRConnection:(SRConnection *)connection didReceiveError:(NSError *)error
{
    NSLog([NSString stringWithFormat:@"Connection Error: %@",error.localizedDescription]);
    //[messagesReceived insertObject:[NSString stringWithFormat:@"Connection Error: %@",error.localizedDescription] atIndex:0];
    //[messageTable reloadData];
}
     

@end

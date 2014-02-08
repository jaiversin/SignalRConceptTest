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

@property (nonatomic, strong) SRHubConnection *hubConnection;
@property (nonatomic, strong) SRHubProxy *chat;

@end

@implementation IGViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
   
    
//    // Connect to the service
    self.hubConnection = [SRHubConnection connectionWithURL:@"http://10.60.6.27/chat/signalr/hubs"];
    // Create a proxy to the chat service
    self.chat = [self.hubConnection createHubProxy:@"ChatHub"];
    
    [self.chat on:@"addNewMessageToPage" perform:self selector:@selector(fromName:message:)];
    // Start the connection
    [self.hubConnection start];
    
    
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Lazy Inst
-(SRHubConnection *)hubConnection
{
    if (!_hubConnection) {
        _hubConnection = [SRHubConnection connectionWithURL:@"http://10.60.6.27/chat/signalr/hubs"];
        
    }
    return _hubConnection;
}

#pragma mark - Receiving Methods
- (void)fromName:(NSString *)name message:(NSString *)message {
    // Print the message when it comes in
    
    NSString *messageWithName = [NSString stringWithFormat:@"%@: %@ \n",name,message];
    
    self.messagesTextView.text = [self.messagesTextView.text stringByAppendingString:messageWithName];
    
}


#pragma mark - Sending Methods
- (IBAction)sendMessage:(id)sender {
    [self.chat invoke:@"Send" withArgs:@[@"Yo", self.textMessageTextField.text]];
    self.textMessageTextField.text = @"";
}

#pragma mark - SRConnectionDelegate Methods
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
